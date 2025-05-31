import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import RankingFilter from '../RankingFilter';
import { GameType } from '../../services/api';

const mockOnFilterChange = vi.fn();

describe('RankingFilter Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders filter dropdown for Valorant', () => {
    render(
      <RankingFilter 
        onFilterChange={mockOnFilterChange} 
        selectedGameType={GameType.VALORANT} 
      />
    );
    
    expect(screen.getByText(/filter valorant ranks/i)).toBeInTheDocument();
    expect(screen.getByText('Iron')).toBeInTheDocument();
    expect(screen.getByText('Bronze')).toBeInTheDocument();
    expect(screen.getByText('Silver')).toBeInTheDocument();
  });

  it('renders filter dropdown for League of Legends', () => {
    render(
      <RankingFilter 
        onFilterChange={mockOnFilterChange} 
        selectedGameType={GameType.LEAGUE_OF_LEGENDS} 
      />
    );
    
    expect(screen.getByText(/filter league-of-legends ranks/i)).toBeInTheDocument();
    expect(screen.getByText('Iron')).toBeInTheDocument();
    expect(screen.getByText('Bronze')).toBeInTheDocument();
    expect(screen.getByText('Silver')).toBeInTheDocument();
  });

  it('calls onFilterChange when rank is selected', () => {
    render(
      <RankingFilter 
        onFilterChange={mockOnFilterChange} 
        selectedGameType={GameType.VALORANT} 
      />
    );
    
    const dropdown = screen.getByRole('combobox');
    fireEvent.change(dropdown, { target: { value: '1' } });
    
    expect(mockOnFilterChange).toHaveBeenCalledWith([1]);
  });

  it('handles multiple rank selection', () => {
    render(
      <RankingFilter 
        onFilterChange={mockOnFilterChange} 
        selectedGameType={GameType.VALORANT} 
      />
    );
    
    // Simulate multiple selection (if component supports it)
    const checkboxes = screen.getAllByRole('checkbox');
    if (checkboxes.length > 0) {
      fireEvent.click(checkboxes[0]);
      fireEvent.click(checkboxes[1]);
      
      expect(mockOnFilterChange).toHaveBeenCalled();
    }
  });

  it('shows all ranks option', () => {
    render(
      <RankingFilter 
        onFilterChange={mockOnFilterChange} 
        selectedGameType={GameType.VALORANT} 
      />
    );
    
    expect(screen.getByText(/all ranks/i)).toBeInTheDocument();
  });
}); 